#!/bin/bash

# rasa train

rasa run actions &

rasa run --enable-api --port 5005
