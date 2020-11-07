from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import os
import json

from mailer import sendMail

app = FastAPI(
    title="WeCode Backend APIs",
    description="API used to do some basic tasks like sending mails",
    version="07.11.2020",
    docs_url="/test",
    redoc_url=None,
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class sendMailInput(BaseModel):
    mailid: str
    subject: str
    message: str

@app.get("/")  # instead of app.route
def index():
    return {"msg": "Everything is Absolutely fine here. What do you want???"}

@app.post("/sendmail")
def send_mail(data: sendMailInput):
    to = data.mailid
    fr = "WeCode <shellsahu@gmail.com>"
    subText = data.subject
    textMessage = data.message
    res = sendMail(to, fr, subText, textMessage)
    return res


if __name__ == "__main__":
    uvicorn.run(app)

# gunicorn
# uvloop
# httptools
# numpy
