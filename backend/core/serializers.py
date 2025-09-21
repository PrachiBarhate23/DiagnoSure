from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Appointment, Reminder, Post, Comment, Category, ExtractedMedicine

# -----------------------
# User
# -----------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


# -----------------------
# User Profile
# -----------------------
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


# -----------------------
# Appointment
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
# -----------------------
# Reminder
# -----------------------
class ReminderSerializer(serializers.ModelSerializer):
    appointment = AppointmentSerializer(read_only=True, default=None)
    appointment_id = serializers.PrimaryKeyRelatedField(
        queryset=Appointment.objects.all(), source="appointment", write_only=True, required=False
    )

    class Meta:
        model = Reminder
        fields = ['id', 'appointment', 'appointment_id', 'remind_at', 'sent']


# -----------------------
# Forum
# -----------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True, default=None)

    class Meta:
        model = Comment
        fields = ["id", "author", "content", "created_at", "parent"]


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True, default=None)
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


# -----------------------
# Extracted Medicines
# -----------------------
class ExtractedMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtractedMedicine
        fields = ['id', 'name', 'description', 'uses', 'dosage', 'confidence', 'uploaded_at']
