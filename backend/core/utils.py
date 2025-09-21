# core/utils.py
from twilio.rest import Client
from django.conf import settings
import requests

def send_sms_reminder(user, message: str):
    """
    Send an SMS reminder/notification to the user's registered phone number.
    """
    if not getattr(settings, "TWILIO_ACCOUNT_SID", None) or not getattr(settings, "TWILIO_AUTH_TOKEN", None):
        print("⚠️ Twilio credentials not set in settings.py")
        return

    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    profile = getattr(user, "profile", None)
    if not profile or not profile.phone_number:
        print(f"⚠️ No phone number found for user {user.username}")
        return

    # ---------- ADD THIS IF CONDITION ----------
    phone_number = profile.phone_number
    if not phone_number.startswith('+91'):
        phone_number = '+91' + phone_number.lstrip('0')
    # -------------------------------------------

    try:
        message_obj = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        print(f"✅ SMS sent to {phone_number} | SID: {message_obj.sid}")
        return message_obj.sid
    except Exception as e:
        print(f"❌ Error sending SMS: {e}")


def send_fcm_notification(user, title: str, body: str):
    """
    Send a web/app push notification using FCM token stored in User model.
    """
    token = getattr(user, "fcm_token", None)
    if not token:
        print(f"⚠️ No FCM token found for user {user.username}")
        return

    fcm_api_key = getattr(settings, "FCM_SERVER_KEY", None)
    if not fcm_api_key:
        print("⚠️ FCM_SERVER_KEY not set in settings.py")
        return

    headers = {
        "Authorization": f"key={fcm_api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "to": token,
        "notification": {
            "title": title,
            "body": body,
        },
        "data": {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "message": body
        }
    }

    try:
        response = requests.post("https://fcm.googleapis.com/fcm/send", json=payload, headers=headers)
        if response.status_code == 200:
            print(f"✅ FCM notification sent to {user.username}")
        else:
            print(f"❌ FCM failed for {user.username}: {response.text}")
    except Exception as e:
        print(f"❌ Error sending FCM: {e}")


def send_notification(user, message: str, title: str = "Healthcare App"):
    """
    Helper function to send both SMS and FCM notifications.
    """
    send_sms_reminder(user, message)
    send_fcm_notification(user, title, message)
