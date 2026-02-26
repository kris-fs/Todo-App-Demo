from rest_framework import serializers
from .models import Todo
from datetime import datetime


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'date', 'completed', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title cannot be empty.")
        return value.strip()

    def create(self, validated_data):
        """
        Create a todo and automatically set date to creation date if not provided.
        """
        # If no date is provided, use today's date (creation date)
        if not validated_data.get('date'):
            validated_data['date'] = datetime.now().date()

        return super().create(validated_data)
