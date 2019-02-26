from typing import List

from backend.tasks.utils import get_queue_length


class QueueMetadata:
    def __init__(self, name: str, priority: int):
        self.name = name
        self.priority = priority


queues = [
    QueueMetadata('Internal', 0),
    QueueMetadata('Priority', 3),
    QueueMetadata('Public', 6),
    QueueMetadata('Reparsing', 9),
]


class QueueStatus:
    def __init__(self, name: str, priority: int, count: int):
        self.name = name
        self.priority = priority
        self.count = count

    @staticmethod
    def create_for_queues() -> List['QueueStatus']:
        counts: List[int] = get_queue_length()
        return [
            QueueStatus(queue_metadata.name, queue_metadata.priority, count)
            for queue_metadata, count in zip(queues, counts)
        ]
