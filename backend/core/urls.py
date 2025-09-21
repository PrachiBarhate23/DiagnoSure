from django.urls import path
from . import views

urlpatterns = [
    path('home/', views.home, name='home'),
    path('profile/complete/', views.complete_profile, name='complete_profile'),
    path('hospitals/search/', views.search_hospitals, name='search_hospitals'),
    path('appointments/book/', views.book_appointment, name='book_appointment'),
    path('appointments/', views.list_appointments, name='list_appointments'),
    path('appointments/cancel/<int:appointment_id>/', views.cancel_appointment, name='cancel_appointment'),
    path('test/notify/', views.test_notify, name='test_notify'),
    path("forum/posts/", views.posts_list_create, name="posts_list_create"),
    path("forum/posts/<int:post_id>/", views.post_detail_comments, name="post_detail_comments"),
    path("forum/posts/<int:post_id>/<str:action>/", views.post_vote, name="post_vote"),
    path('upload-prescription/', views.upload_prescription, name='upload_prescription'),
    path('prescription/reminders/create/', views.create_prescription_reminders, name='create_prescription_reminders'),
    path('reminders/list/', views.list_all_reminders, name='list_all_reminders'),


]
