# SIPIVR
SIPIVR is a moduled ivr designer.
SIPIVR lets you create applications for voice response systems. 

Video: https://www.youtube.com/watch?v=BGIrc9PPLF8

# SIPIVR modules:
• sipivr.system
• sipivr.speech
• sipivr.sound
• sipivr.schedule
• sipivr.report
• sipivr.registration
• sipivr.number
• sipivr.date
• sipivr.currency
• sipivr.cbr

# Overview
- uses Freeswitch with simple configuration
- works over SIP
- consists of modules (each module is a JAR-file with Java code, web-pages, javascript, css and other)
- uses WebRTC
- supports scripting (javascript, typescript)
- supports drag&drop wav/mp3 files

# Build/Installing
• install freeswitch from https://freeswitch.org
• execute "npm run build" in folder https://github.com/okarpukhin/sipivr/tree/master/freeswitch/typescript
• replace standard folder "freeswitch/conf" on "sipivr/freeswitch/conf"
• replace standard folder "freeswitch/scripts" on "sipivr/freeswitch/scripts"
• install jdk 1.8, mvn and tomcat 8
• execute "mvn install" in folder sipivr
• copy folder content "sipivr/sipivr.web/target/sipivr.web" in folder "tomcat/webapps/ROOT"
• run freeswitch and tomcat