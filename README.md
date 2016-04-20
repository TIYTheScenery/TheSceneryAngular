# The Scenery

The Scenery aims to support the performing arts industry by providing resources for patrons of the arts and artists alike.. You can find out about your local performance scene whether you’re a patron looking for fresh entertainment, an actor looking for an audition, or a company looking to promote their work.

The Scenery utilizes some of the latest web technologies to bring live performance to you! Built with HTML5 and CSS3, using an Angular.js and Jquery front end supported by Ruby on Rails and PostgreSQL database serving up our API. The-Scenery.com is served to all your devices by Heroku and Firebase servers wrapped in one domain with Amazon Web Services providing additional file storage for the images.

The Scenery allows everyone to have the performing arts at their fingertips. Bertolt Brecht once said, “The play isn’t finished until people are in the streets talking about it.” The street corner is now digital, and its bustling live at www.the-scenery.com.

## The Database
  All of the info is stored with Ruby on Rails API database.

## What can it do?
  It has a number of different subsets of use:

  * Search Feature
    * Keyword Search: Entering any word or phrase in the search text field will run through all Companies,
    Performances, and Professionals in the database to return any that have the word or phrase in their name,
    title, or description.
    * Advanced Search options allow:
      * Search by Genre (Theatre, Improve, Dance, or Film)
      * Search by Type (Professionals, Companies, or Performances.)
      * Search by City, State, or Zip Code
  * Sign Up
    * User is given the option to be a Professional on the site when they sign up.
      * Professionals have the ability to create Companies, Performances, and Opportunities. They can also leave Reviews.
      * Non Professional Users can search all information in the database and leave Reviews on the Companies and Performances as well.
  * Profile Page
    * Every user can upload a profile Picture, edit their information, and add a description to their page.  
    * All of the Reviews they have left on the site will populate their page.
    * Professionals can have the above features as well as:
      * Social Media Links.
      * Title to denote their skill set.
      * All of the Companies they have created listed.
  * Company Page
    * Can add a background image as well as a profile picture for the company.
    * It lists the reviews of your Company.
    * It lists your upcoming performances as well as your past performances.
      * Clicking on the performance will bring you to that Performance's show page.
    * Displays social media links, website link, location, and Company description.
    * Displays the Opportunities you have created.
      * Opportunities can be audition notices, job postings, or anything other need for outside collaborators your Company needs.
  * Performance Page
    * Displays your Company's name and the Performance name.
    * Has the Performance's description, ticketing link, trailer link, tags to refine the show's genre, reviews on the show, and all of the show's performance times.
