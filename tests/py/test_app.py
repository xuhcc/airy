def test_app_settings(app, config):
    assert app.debug is False
    assert config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] is False
