from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # <-- optional if some users don’t add phone immediately
    medical_conditions = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    medications = models.TextField(blank=True)
    past_treatments = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

from django.db import models

class Appointment(models.Model):
    doctor_name = models.CharField(max_length=255)
    hospital_name = models.CharField(max_length=255)
    date = models.DateField()
    time = models.TimeField()
    symptoms = models.TextField()
    status = models.CharField(max_length=50, default='booked')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.doctor_name} - {self.hospital_name} on {self.date}"



class Reminder(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE)
    remind_at = models.DateTimeField()
    sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Reminder for {self.appointment} at {self.remind_at}"

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvotes = models.ManyToManyField(User, related_name="upvoted_posts", blank=True)
    downvotes = models.ManyToManyField(User, related_name="downvoted_posts", blank=True)

    def score(self):
        return self.upvotes.count() - self.downvotes.count()

    def __str__(self):
        return f"{self.title} by {self.author.username}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="replies")

    def __str__(self):
        return f"Comment by {self.author.username} on {self.post.title}"


class ExtractedMedicine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    uses = models.TextField()
    dosage = models.CharField(max_length=255)
    confidence = models.FloatField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.confidence:.2f})"
    

class Reminder(models.Model):
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    remind_at = models.DateTimeField()
    sent = models.BooleanField(default=False)

    def __str__(self):
        if self.appointment:
            return f"Reminder for {self.appointment} at {self.remind_at}"
        return f"Prescription reminder at {self.remind_at}"

