from django.db import models
from django.contrib.auth.models import User

class post(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE, related_name='posts')
    image=models.ImageField(upload_to='pics/')
    caption=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.caption
    


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)

    def __str__(self):
        return self.user.username