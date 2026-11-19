FROM debian:trixie
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get install -y --no-install-recommends apache2 && \
    rm -rf /var/lib/apt/lists/*
COPY vhosts.conf /etc/apache2/sites-available/vhosts.conf
RUN a2dissite 000-default && a2ensite vhosts
EXPOSE 80 8081 8082
CMD ["apache2ctl", "-D", "FOREGROUND"]