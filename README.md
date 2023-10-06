
# Welcome to the backend of Foodmates!

This is a group project for our curriculum, a dating-app style application aimed at connecting local producers with companies interested in their products (such as local shops and restaurants) to support the local economy. 

The backend is deployed on Heroku: [https://cryptic-everglades-98939-27f4f380a338.herokuapp.com/](https://cryptic-everglades-98939-27f4f380a338.herokuapp.com/)

# How does it work?

The backend has been developed using *Express.js* with a connection to *MongoDB*.

## User profiles

There are two types of users: *Providers* and *Shops*.

### Providers

(= producers)
Their profile was pretty static, they could choose a *category*, add custom *tags* and fill out their information (*name*, *address* (with their address, their location coordinates were automatically calculated) *contact details* etc.)

### Shops

After filling out their profile, they could search for producers with specific criteria: *categories*, *tags* and *location*. They then had the opportunity to contact producers they were interested in via the built-in message function.

## Other relevant characteristics

### Conversation and messages

Conversations could only be initiated by Shops (to avoid spamming). 

### Categories

Categories were to be chosen from an already-determined list. (ex: *vegetables*, *meat* or *clothes*) 

### Tags

Tags could be used to give more information about the product (*available* or *looked for*). They were directly typed by the user. Some basic NLP processes were used to clean the data, (*stemming*) and not overlook some possible matching due to typos. (ex: "carrot**s**" => *carrot* & "carrot" => *carrot* as well).

### Search criteria

Search criteria and results were saved within the shop profile.

### Security and protection

Many routes were protected via *JWT*.
Passwords were hashed before saved in the database.
Open fields were protected against *XSS* attacks.

# How to run this project

The backend is deployed on Heroku: [https://cryptic-everglades-98939-27f4f380a338.herokuapp.com/](https://cryptic-everglades-98939-27f4f380a338.herokuapp.com/)

All the route information can be available on this *Postman documentation*: [https://documenter.getpostman.com/view/28752391/2s9YC4Ut9r](https://documenter.getpostman.com/view/28752391/2s9YC4Ut9r)


# Self-reflection and future improvements

## Quick fixes

A few functionalities have been put aside due to time constrictions: *Score attribution*, *Price Score attribution* and *testimonials*.

## More ambitious improvements

The next big step would be to design a frontend interface!
