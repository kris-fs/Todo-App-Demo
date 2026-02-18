from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from datetime import datetime
from .models import Todo
from .serializers import TodoSerializer


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['completed', 'date']
    ordering_fields = ['created_at', 'date', 'completed']
    ordering = ['-created_at']

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        """Get todos for a specific date"""
        date_str = request.query_params.get('date')
        if not date_str:
            return Response({'error': 'date parameter is required'}, status=400)

        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

        todos = Todo.objects.filter(date=date)
        serializer = self.get_serializer(todos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_completed(self, request, pk=None):
        """Toggle the completed status of a todo"""
        todo = self.get_object()
        todo.completed = not todo.completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)
