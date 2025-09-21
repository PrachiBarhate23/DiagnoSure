# core/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import Reminder
from .utils import send_notification

@shared_task(bind=True, max_retries=3, default_retry_delay=15)
def send_pending_reminders_task(self):
    """
    Send pending appointment reminders via SMS + FCM.
    """
    now = timezone.now()
    reminders = Reminder.objects.filter(remind_at__lte=now, sent=False)
    for reminder in reminders:
        appointment = reminder.appointment
        user = appointment.patient
        message = f"Reminder: Your appointment with Dr. {appointment.doctor_name} is on {appointment.date} at {appointment.time}."

        try:
            send_notification(user, message)
            reminder.sent = True
            reminder.save()
        except Exception as e:
            print(f"❌ Failed to send reminder for {user.username}: {e}")
            self.retry(exc=e)
