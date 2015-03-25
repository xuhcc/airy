import pytest

from airy.serializers import ClientSerializer

from factories import ClientFactory


@pytest.mark.usefixtures('db_class')
class TestClientSerializer():

    def test_serialization(self):
        client = ClientFactory.create()
        self.db.session.commit()
        serializer = ClientSerializer(strict=True)
        data = serializer.dump(client).data
        assert data['id'] == client.id
        assert data['name'] == client.name
        assert data['contacts'] == client.contacts
        assert 'projects' in data

    def test_create(self):
        data = ClientFactory.stub().__dict__
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.name == data['name']
        assert instance.id is None

    def test_update(self):
        client = ClientFactory.create()
        self.db.session.commit()
        data = ClientFactory.stub().__dict__
        data['id'] = client.id
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert not errors
        assert instance.name == data['name']
        assert instance.id == client.id

    def test_required(self):
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load({})
        assert 'name' in errors

    def test_unique_name(self):
        client = ClientFactory.create()
        self.db.session.commit()

        data = ClientFactory.stub(name=client.name).__dict__
        serializer = ClientSerializer(exclude=['projects'])
        instance, errors = serializer.load(data)
        assert 'name' in errors
