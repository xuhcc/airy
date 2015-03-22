def test_app_settings(app):
    assert 'sqlite' in app.config['SQLALCHEMY_DATABASE_URI']
