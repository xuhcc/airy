import logging
import smtplib
from email.mime.text import MIMEText

from airy import settings

logger = logging.getLogger(__name__)


def send(subject, text, recipients):
    """
    Send email message
    """
    if isinstance(recipients, str):
        recipients = [recipients]
    for recipient in recipients:
        message = MIMEText(text, 'plain')
        message['From'] = settings.smtp_sender
        message['To'] = recipient
        message['Subject'] = subject
        # Connect to SMTP server
        try:
            session = smtplib.SMTP(host=settings.smtp_server,
                                   port=settings.smtp_port)
            session.ehlo()
            session.starttls()
            session.ehlo()
            session.login(settings.smtp_user,
                          settings.smtp_password)
            session.send_message(message)
            session.quit()
        except smtplib.SMTPException as error:
            logger.error('Failed to deliver the email')
            logger.exception(error)
        else:
            logger.info('The email has been delivered')
