#base image 
FROM rasa/rasa:3.6.20-full

WORKDIR /app

COPY ../Model .

USER root

ENV HOME=/app

RUN pip install --upgrade pip
RUN pip install -r /app/requirment.txt

# Set the NLTK data  env var
ENV NLTK_DATA=/app/nltk_data

# Download NLTK dependecies
RUN python -m nltk.downloader punkt
RUN python -m nltk.downloader stopwords

RUN rasa train


EXPOSE 5005

#entry point script
ENTRYPOINT ["/app/start_services.sh"]


