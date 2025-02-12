from app import db
from app.models.project import Project
from flask import jsonify, request


class ProjectController:
    @staticmethod
    def create_project():
        data = request.get_json()

        # Validate required fields
        required_fields = ["title", "description", "technologies"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        project = Project(
            title=data["title"],
            description=data["description"],
            technologies=data["technologies"],
            link=data.get("link", ""),
        )

        db.session.add(project)
        db.session.commit()

        return jsonify(project.to_dict()), 201

    @staticmethod
    def get_all_projects():
        projects = Project.query.all()
        return jsonify([project.to_dict() for project in projects])

    @staticmethod
    def get_project_by_id(id):
        project = Project.query.get_or_404(id)
        return jsonify(project.to_dict())

    @staticmethod
    def delete_project(id):
        project = Project.query.get_or_404(id)
        db.session.delete(project)
        db.session.commit()
        return "", 204
