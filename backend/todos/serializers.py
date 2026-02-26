from rest_framework import serializers
from .models import Todo
from datetime import datetime


class TodoSerializer(serializers.ModelSerializer):
    # Add a computed field that returns date or created_at date if date is NULL
    effective_date = serializers.SerializerMethodField()

    class Meta:
        model = Todo
        fields = ['id', 'title', 'description', 'date', 'completed', 'created_at', 'updated_at', 'effective_date']
        read_only_fields = ['id', 'created_at', 'updated_at', 'effective_date']

    def get_effective_date(self, obj):
        """
        Return the date field if it exists, otherwise return the date part of created_at.
        This ensures all todos have a date for filtering purposes.
        """
        if obj.date:
            return obj.date
        # Extract just the date part from created_at timestamp
        return obj.created_at.date()

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
