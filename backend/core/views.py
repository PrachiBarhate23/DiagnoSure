# core/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import UserProfile, Appointment, Reminder
from .serializers import UserProfileSerializer, AppointmentSerializer
from .utils import send_notification
from django.http import JsonResponse
import requests
from .models import Post, Comment, Category
from .serializers import PostSerializer, CommentSerializer, CategorySerializer
from rest_framework import status
from .models import ExtractedMedicine
from .serializers import ExtractedMedicineSerializer
from .ai_model.extractor import MedicineExtractor
import tempfile,os

extractor = MedicineExtractor()

# -----------------------
# Home / health check
# -----------------------
def home(request):
    return JsonResponse({"message": "Healthcare Backend is running"})

# -----------------------
# Complete profile
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
# Search nearby hospitals
# -----------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
# Book appointment
# -----------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    serializer = AppointmentSerializer(data=request.data)
    if serializer.is_valid():
        appointment = serializer.save(patient=request.user)

        # Add reminder 1 day before
        remind_at = timezone.datetime.combine(appointment.date, appointment.time) - timedelta(days=1)
        Reminder.objects.create(appointment=appointment, remind_at=remind_at)

        message = f"✅ Your appointment with Dr. {appointment.doctor_name} is booked on {appointment.date} at {appointment.time}."
        send_notification(request.user, message, title="Appointment Confirmed")

        return Response({"message": "Appointment booked successfully", "appointment": serializer.data})
    return Response(serializer.errors, status=400)

# -----------------------
# List appointments
# -----------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user)
    serializer = AppointmentSerializer(appointments, many=True)
    return Response(serializer.data)

# -----------------------
# Cancel appointment
# -----------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id, patient=request.user)
        appointment.status = 'cancelled'
        appointment.save()

        message = f"⚠️ Your appointment with Dr. {appointment.doctor_name} on {appointment.date} has been cancelled."
        send_notification(request.user, message, title="Appointment Cancelled")

        return Response({"message": "Appointment cancelled"})
    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

# -----------------------
# Test notification
# -----------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_notify(request):
    send_notification(request.user, "This is a test reminder from Healthcare app", title="Test Notification")
    return Response({"message": "Test notifications sent"})

# -----------------------
# Forum: Posts
# -----------------------
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def posts_list_create(request):
    if request.method == "GET":
        posts = Post.objects.all().order_by("-created_at")
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
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
            serializer.save(author=request.user, post=post)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# -----------------------
# Forum: Voting
# -----------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_vote(request, post_id, action):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=404)

    if action == "upvote":
        post.upvotes.add(request.user)
        post.downvotes.remove(request.user)
    elif action == "downvote":
        post.downvotes.add(request.user)
        post.upvotes.remove(request.user)
    else:
        return Response({"error": "Invalid action"}, status=400)

    return Response({"message": f"{action} recorded", "score": post.score()})


@api_view(['POST'])
def upload_prescription(request):
    if 'file' not in request.FILES:
        return Response({'error': 'No file provided'}, status=400)

    file = request.FILES['file']

    # Save to temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.name)[1]) as temp_file:
        for chunk in file.chunks():
            temp_file.write(chunk)
        file_path = temp_file.name

    try:
        # Extract medicines
        medicines = extractor.extract_medicines_from_image(file_path)

        saved_medicines = []
        for med in medicines:
            obj, created = ExtractedMedicine.objects.update_or_create(
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
        # Cleanup temp file
        if os.path.exists(file_path):
            os.remove(file_path)

# core/views.py
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_prescription_reminders(request):
    """
    Hardcoded prescription reminders for a user.
    """
    user = request.user
    # Example prescription details
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
        # For demonstration, create reminders 1 hour apart starting now
        remind_at = now + timedelta(hours=idx + 1)
        reminder = Reminder.objects.create(
            appointment=None,  # No linked appointment
            remind_at=remind_at
        )
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_prescription_reminders(request):
    user = request.user
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
        reminder = Reminder.objects.create(
            appointment=None,  # No linked appointment
            remind_at=remind_at
        )
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_all_reminders(request):
    user = request.user
    appointment_reminders = Reminder.objects.filter(appointment__patient=user)
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
