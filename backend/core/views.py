from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from .models import UserProfile, Appointment, Reminder, Post, Comment, Category, ExtractedMedicine
from .serializers import (
    UserProfileSerializer,
    AppointmentSerializer,
    PostSerializer,
    CommentSerializer,
    CategorySerializer,
    ExtractedMedicineSerializer
)
from .utils import send_notification
from .ai_model.extractor import MedicineExtractor
import tempfile, os
import requests
from rest_framework import status
from django.contrib.auth.models import AnonymousUser
from rest_framework.decorators import api_view, permission_classes, authentication_classes


extractor = MedicineExtractor()

# -----------------------
# Home / health check
# -----------------------
def home(request):
    return JsonResponse({"message": "Healthcare Backend is running"})


# -----------------------
# Complete profile (requires login)
# -----------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_profile(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Profile updated successfully", "profile": serializer.data})
    return Response(serializer.errors, status=400)


# -----------------------
# Search nearby hospitals (public)
# -----------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def search_hospitals(request):
    query = request.GET.get('query', 'hospital')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    if not lat or not lon:
        return Response({"error": "Latitude and longitude are required"}, status=400)

    try:
        lat = float(lat)
        lon = float(lon)
    except ValueError:
        return Response({"error": "Invalid latitude or longitude"}, status=400)

    delta = 0.03
    viewbox = f"{lon - delta},{lat - delta},{lon + delta},{lat + delta}"
    url = "https://nominatim.openstreetmap.org/search"
    params = {'q': query, 'format': 'json', 'limit': 20, 'viewbox': viewbox, 'bounded': 1}
    response = requests.get(url, params=params, headers={'User-Agent': 'HealthcareApp'})
    data = response.json()

    results = []
    for item in data:
        results.append({
            "name": item.get("name"),
            "display_name": item.get("display_name"),
            "lat": item.get("lat"),
            "lon": item.get("lon"),
            "osm_id": item.get("osm_id"),
            "type": item.get("type"),
            "class": item.get("class")
        })
    return Response(results)

# -----------------------
# Book Appointment (public or authenticated)
@api_view(['POST'])
@permission_classes([AllowAny])
def book_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save()  # no patient needed
        return Response({'success': True, 'appointment': serializer.data})
    return Response({'success': False, 'errors': serializer.errors}, status=400)
# -----------------------
# List Appointments
# -----------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def list_appointments(request):
    """
    List all appointments.
    """
    appointments = Appointment.objects.all().order_by('-date', '-time')
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


# -----------------------
# Cancel Appointment
# -----------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def cancel_appointment(request, appointment_id):
    """
    Cancel an appointment by ID.
    """
    try:
        appointment = Appointment.objects.get(id=appointment_id)
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

    appointment.status = "cancelled"
    appointment.save()
    return Response({"success": True, "message": "Appointment cancelled"})


# -----------------------
# List All Reminders
# -----------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def list_all_reminders(request):
    """
    List all reminders (appointments + prescription).
    """
    appointment_reminders = Reminder.objects.filter(appointment__isnull=False)
    prescription_reminders = Reminder.objects.filter(appointment__isnull=True)

    all_reminders = list(appointment_reminders) + list(prescription_reminders)
    all_reminders.sort(key=lambda r: r.remind_at)

    serializer = ReminderSerializer(all_reminders, many=True)
    return Response({"reminders": serializer.data})
# -----------------------
# Upload prescription (public)
# -----------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def upload_prescription(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=400)

    file = request.FILES['file']
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.name)[1]) as temp_file:
        for chunk in file.chunks():
            temp_file.write(chunk)
        file_path = temp_file.name

    try:
        medicines = extractor.extract_medicines_from_image(file_path)
        saved_medicines = []
        for med in medicines:
            obj, _ = ExtractedMedicine.objects.update_or_create(
                name=med.name,
                defaults={
                    'description': med.description,
                    'uses': med.uses,
                    'dosage': med.dosage,
                    'confidence': med.confidence
                }
            )
            saved_medicines.append(obj)

        serializer = ExtractedMedicineSerializer(saved_medicines, many=True)
        return Response({
            'success': True,
            'message': f'{len(saved_medicines)} medicines extracted and saved',
            'medicines': serializer.data
        })

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


# -----------------------
# Create prescription reminders (public)
# -----------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def create_prescription_reminders(request):
    prescription_items = [
        {"name": "Paracetamol", "dosage": "- 2 times a day"},
        {"name": "Omeprazole", "dosage": "- once before meals"},
        {"name": "Amoxicillin", "dosage": "- 3 times a day"},
        {"name": "Cetirizine", "dosage": "- at night"},
        {"name": "Ibuprofen", "dosage": "- if pain persists"},
    ]
    reminders_created = []
    now = timezone.now()
    for idx, med in enumerate(prescription_items):
        remind_at = now + timedelta(hours=idx + 1)
        Reminder.objects.create(appointment=None, remind_at=remind_at)
        reminders_created.append({
            "medicine": med["name"],
            "dosage": med["dosage"],
            "remind_at": remind_at
        })

    return Response({
        "success": True,
        "message": f"{len(reminders_created)} prescription reminders created",
        "reminders": reminders_created
    })


# -----------------------
# Forum: Posts (public)
# -----------------------
@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def posts_list_create(request):
    if request.method == "GET":
        posts = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=None)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([AllowAny])
def post_detail_comments(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    if request.method == "GET":
        serializer = PostSerializer(post)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=None, post=post)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
def post_vote(request, post_id, action):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    if action == "upvote":
        post.upvotes.clear()
        post.downvotes.clear()
    elif action == "downvote":
        post.upvotes.clear()
        post.downvotes.clear()
    else:
        return Response({"error": "Invalid action"}, status=400)

    return Response({"message": f"{action} recorded", "score": post.score()})


# -----------------------
# List all reminders (public)
# -----------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def list_all_reminders(request):
    appointment_reminders = Reminder.objects.filter(appointment__isnull=False)
    prescription_reminders = Reminder.objects.filter(appointment__isnull=True)

    all_reminders = list(appointment_reminders) + list(prescription_reminders)
    all_reminders.sort(key=lambda r: r.remind_at)

    response_data = []
    for r in all_reminders:
        if r.appointment:
            response_data.append({
                "type": "appointment",
                "doctor": r.appointment.doctor_name,
                "hospital": r.appointment.hospital_name,
                "date": r.appointment.date,
                "time": r.appointment.time,
                "remind_at": r.remind_at
            })
        else:
            response_data.append({
                "type": "prescription",
                "remind_at": r.remind_at
            })

    return Response({"reminders": response_data})

@api_view(['GET'])
@permission_classes([AllowAny])
def list_appointments(request):
    appointments = Appointment.objects.all()
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def test_notify(request):
    message = request.data.get("message", "Test notification from Healthcare backend")
    try:
        send_notification(message)
        return Response({"success": True, "message": "Notification sent"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
