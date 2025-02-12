from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

db = SQLAlchemy()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)

    from app.routes.project_routes import project_bp

    app.register_blueprint(project_bp)

    with app.app_context():
        db.create_all()

    return app
