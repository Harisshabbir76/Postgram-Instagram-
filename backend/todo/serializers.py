from rest_framework import serializers
from .models import post

class Postserializers(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username", read_only=True) 

    class Meta:
        model = post
        fields = ['id', 'caption', 'image', 'image_url', 'username', 'created_at'] 
        read_only_fields = ['user', 'created_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
