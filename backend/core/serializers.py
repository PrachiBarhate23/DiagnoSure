from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Appointment, Reminder
from .models import Category, Post, Comment
from .models import ExtractedMedicine

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'user',
            'phone_number',
            'medical_conditions',
            'allergies',
            'medications',
            'past_treatments'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)  # <-- show patient info in response

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient',
            'doctor_name',
            'hospital_name',  # <-- added hospital_name
            'date',
            'time',
            'symptoms',
            'status'
        ]
        read_only_fields = ['patient']


class ReminderSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only=True)  # <-- return full appointment info
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source="appointment", write_only=True
    )

    class Meta:
        model = Reminder
        fields = ['id', 'appointment', 'appointment_id', 'remind_at', 'sent']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at", "parent"]


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    score = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "author",
            "category",
            "title",
            "content",
            "created_at",
            "updated_at",
            "score",
            "comments",
        ]
        read_only_fields = ["author"]

    def get_score(self, obj):
        return obj.score()

class ExtractedMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedMedicine
        fields = ['id', 'name', 'description', 'uses', 'dosage', 'confidence', 'uploaded_at']