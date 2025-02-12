from flask import Blueprint
from app.controllers.project_controller import ProjectController

project_bp = Blueprint("project", __name__)


@project_bp.route("/projects", methods=["POST"])
def create_project():
    return ProjectController.create_project()


@project_bp.route("/projects", methods=["GET"])
def get_projects():
    return ProjectController.get_all_projects()


@project_bp.route("/projects/<int:id>", methods=["GET"])
def get_project(id):
    return ProjectController.get_project_by_id(id)


@project_bp.route("/projects/<int:id>", methods=["DELETE"])
def delete_project(id):
    return ProjectController.delete_project(id)
