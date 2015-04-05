import datetime

from airy.utils import date, email


class TestDateUtils():

    def test_tz_now(self):
        now = date.tz_now()
        assert now.tzinfo is not None

    def test_day_beginning(self):
        dt = datetime.datetime(2015, 3, 23, 20, 20, 20, tzinfo=date.timezone)
        beginning = date.day_beginning(dt)
        assert beginning.hour == 0
        assert beginning.minute == 0
        assert beginning.second == 0
        assert beginning.date() == dt.date()

    def test_week_beginning(self):
        dt = datetime.datetime(2015, 3, 24, 20, 20, 20, tzinfo=date.timezone)
        beginning = date.week_beginning(dt)
        assert beginning.hour == 0
        assert beginning.minute == 0
        assert beginning.second == 0
        assert beginning.date() == dt.date() - datetime.timedelta(days=1)


class TestEmailUtils():

    def test_send(self, mocker):
        smtp_mock = mocker.patch('airy.utils.email.smtplib.SMTP')
        email.send('TestSubject', 'TestContent', 'test@example.net')
        session_mock = smtp_mock.return_value
        assert session_mock.login.called
        assert session_mock.send_message.call_count == 1
        message = session_mock.send_message.call_args[0][0]
        assert message['Subject'] == 'TestSubject'
        assert message['To'] == 'test@example.net'
