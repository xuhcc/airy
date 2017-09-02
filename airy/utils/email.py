import logging
import smtplib
from email.mime.text import MIMEText
from typing import List

from airy import settings

logger = logging.getLogger(__name__)


def send(subject: str, text: str, recipients: List[str]):
    """
    Send email message
    """
    if isinstance(recipients, str):
        recipients = [recipients]
    for recipient in recipients:
        message = MIMEText(text, 'html')
        message['From'] = settings.SMTP_SENDER
        message['To'] = recipient
        message['Subject'] = subject
        # Connect to SMTP server
        try:
            session = smtplib.SMTP(host=settings.SMTP_SERVER,
                                   port=settings.SMTP_PORT)
            session.ehlo()
            session.starttls()
            session.ehlo()
            session.login(settings.SMTP_USER,
                          settings.SMTP_PASSWORD)
            session.send_message(message)
            session.quit()
        except smtplib.SMTPException as error:
            logger.error('Failed to deliver the email')
            logger.exception(error)  # type: ignore
        else:
            logger.info('The email has been delivered')
