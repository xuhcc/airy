def test_app_settings(config):
    assert 'sqlite' in config['SQLALCHEMY_DATABASE_URI']
    assert config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] is False
