from __future__ import absolute_import

from datetime import timedelta
from django.utils import timezone
from rest_framework.response import Response

from sentry.app import tsdb
from sentry.api.bases.project import ProjectEndpoint
from sentry.models import Environment


class ProjectUserStatsEndpoint(ProjectEndpoint):
    def get(self, request, project):
        now = timezone.now()
        then = now - timedelta(days=30)

        environment = request.GET.get('environment')
        query_kwargs = {}
        if environment is not None:
            query_kwargs['environment'] = Environment.get_for_organization_id(
                project.organization_id,
                environment,
            )

        results = tsdb.rollup(
            tsdb.get_distinct_counts_series(
                tsdb.models.users_affected_by_project,
                (project.id, ),
                then,
                now,
                **query_kwargs
            ), 3600 * 24
        )[project.id]

        return Response(results)
