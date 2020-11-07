import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os

import base64

import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from apiclient import errors

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]


def create_message(
    to, sender, subject, textMessage=None, htmlfile=None
):
    msg = MIMEMultipart("alternative")
    msg["subject"] = subject
    msg["from"] = sender
    msg["to"] = to
    if textMessage == None:
        textMessage = "Hey there!!\nWelcome\nHere is the link of our site:\nhttps://www.caffetable.com"

    if htmlfile==None:
        textPart = MIMEText(textMessage, "plain")
        msg.attach(textPart)
    else:
        html = open(htmlfile).read()
        textPart = MIMEText(textMessage, "plain")
        htmlPart = MIMEText(html, "html")
        msg.attach(textPart)
        msg.attach(htmlPart)

    # msg_bytes = data_string.encode("utf-8")
    raw = base64.urlsafe_b64encode(msg.as_bytes())
    raw = raw.decode()
    return {"raw": raw}


def send_message(service, user_id, message):
    try:
        message = (
            service.users().messages().send(userId=user_id, body=message).execute()
        )
        return message["id"]
    except errors.HttpError as error:
        return error

    return True

def sendMail(to, fr, subText, textMessage):
    if os.path.exists("token.pickle"):
        with open("token.pickle", "rb") as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    else:
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.pickle", "wb") as token:
            pickle.dump(creds, token)

    service = build("gmail", "v1", credentials=creds)

    message = create_message(to, fr, subText,textMessage)
    sent = send_message(service, "me", message)
    print(f"mail sent to {to}. ID: {sent}")
    return {"status":'200', "msg": f"mail sent to {to}"}



if __name__ == "__main__":
    to = "shaileshkumar2604@gmail.com"
    toName = "Shailesh"
    fr = "Wecode <shellsahu@gmail.com>"
    sub = "You have got a notification from WeCode"
    text = f"Hi {toName}! I need your assistance."
    # text = f"Hey {toName}!!\nWelcome to CaffeTable. We will contact you soon\nHere is the link of our site:\nhttps://www.caffetable.com"
    # sendWelcomeMail(to, toName, fr, textMessage=text)
    sendMail(to,fr,subText=sub,textMessage=text)
