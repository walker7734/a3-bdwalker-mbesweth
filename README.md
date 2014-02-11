Seattle 911 Police Calls 
====================
Group Members
--------------------
- Brian Walker
- Michael Beswetherick

Tools
--------------------
We used the following development tools and frameworks to complete the assignment:
- Google Maps API
- HTML / CSS
- JQuery
- SODA2 API
- D3

Data Set
--------------------
The dataset we chose looks at 911 calls to the police department and is updated on a 4 hour basis by the city of Seattle. The calls are separated into groups and then into further subgroups.  Each call has information about the sector, id, time and beat where the call took place.  We thought this would be interesting to see where certain crimes take place in the city and to easily see if there are patterns as to where certain types of crime take place. The data can be obtained from <a href="https://data.seattle.gov/Public-Safety/Seattle-Police-Department-911-Incident-Response/3k2p-39jp">data.seattle.gov</a>.

A Note About the Data
--------------------
We did not download the entire data set from the Seattle database as we wanted to allow the user to get up to date information. In addition, it was several gigabytes of data which would make it difficult to deal with.  Instead we use an API to query the database.  In our experience the response time is extremely variable. Sometimes it will return within several hundred milliseconds and other times it will take upwards of 15 seconds.  This causes a delay in which nothing appears to be happening.  We added a small spinner in the bottom right corner of the filter window to indicate querying activity.  This was added in at the last minute and is not terribly elegant but it does provide information about what is taking place on the network. 

We could have also implemented some caching techniques to speed up this process but this required additional logic and we wanted to focus on the primary task of the assignment, the visualization, and not the speed/efficiency.  

Storyboard and Iteractions
--------------------
Our storyboard shows the general layout of what we wanted to achieve.  It also displays the different types of interactivity that we wanted the user to have with the data.  We wanted to be sure that the user could select different categories from the types of calls.  The data set is split into groups such as "HOMICIDE", "ASSAULT- OTHER", "ASSAULT-GANG RELATED", and so on.  Grouping these types of calls into categories ensured that the user wasn't overwhelmed by the massive amounts of categories available.  The data goes back as far as 2010 so we thought it would be appropriate to filter based on date as well.  We provided a start and end date to allow for a window to be chosen between any two dates.This allows user to filter based on both the time and the category of the call.  

To display the data we envisioned a map since the data set gives us latitude and longitude coordinates  This provides a natural visualization that anyone can understand.  If the user selects multiple categories we envisioned each one being displayed in a different color. The colors we chose came from the Tableau palette to ensure we weren't choosing colors randomly and that the ones we chose were sufficiently different from one another. 

We also wanted users to be able to interact with the data points themselves. We wanted the user to be able to click on any particular data point and display information about that particular call. The information would be shown in the bottom left corner to keep it from distracting from the main map area.  The filter selection area should also be either clickable or listen for a mouse-over event and slide out of the way to reduce clutter to the screen. 

Sometimes the amount of data can be huge if the date window is very large.  We want users to be able to select a tab to switch "modes" on the site.  The new mode would allow a category and date range to be displayed in a heat map that would make it very easy to see hot spots in the city.  The heat map would be generated by creating a square grid over the city and then filling each grid with hue based on how many data points fall within that square.  We could also display some simple statistics and allow the user to select a particular square to see more information. 

We feel that the mix of color, position and context all work with the data directly to produce an easy to interpret interactive map.

Our storyboard is hand drawn and has no color, since we had not yet decided what color scheme to use.  It is rather bland compared to some others but its primary use, to guide our design and interaction, was successful.  It can be found <a href="https://www.dropbox.com/s/k4s8lg4vby2m6tb/storyboard.pdf">here</a>

Final Visualization
--------------------
Our final visualization stays quite close to our initial vision.  We have an overlayed window on the right side of the web page to allow for the user to interact with the different filters. If the user wishes to remove the window form view they can click on the three vertical bars just to the left of the window.  This will cause the window to slide out of view.  

We provide various differnt filters to interact with the data.  We allow users to select what category of crime they wish to explore.  These have been bucketed because of the vast amount of groups that are present in the data set.  We allow users to filter on the following crime categories: Theft, Harbor Violations, Violent Crime, Sex Crime, Disturbances and Drugs and Narcotics.  We realized that this might be too broad since one category can have many sub groups.  Thus, we provide a text field to allow for a custom search of the database.  For instance, if a user wanted to just see homicides and no other violent crime then they could just type 'homicide' into the custom search box. Each filter has a unique color encoding that is indicated to its right.  These colors were selected by using the Tableau 20 color palette to ensure we picked colors that were different enough to easily differentiate from one another. This is also the reason we limited our filters to 7 since any more colors would be difficult to differentiate. 

The data can also be filtered by date.  We wanted users to be able to select calls based on a window of time.  Users can thus enter a beginning and ending date as well as a time range.  One important aspect is the hour time range is from, say 12:00 to 13:00, then that does not mean that everything outside of these time ranges are filtered unless the date range is the same day.  So if 2014-01-01 and 2014-02-01 are selected for the dates then it will filter out everything before noon on January 1st and after 1:00 pm on February second.  The hour filter is most useful for single day intervals. 

Finally, users can select on individual data points to see information about that call in the lower left hand corner.  This provides information about the type of call, the time of the incident and its id. 

Differences From Storyboard
--------------------

Our final interactive visualization allows for all of the above with the exception of selecting based on a neighborhood and the heat map.  We were able to find GeoJson data from Zillow that gave us the geometry for the neighborhoods around Seattle. However, the problem was that we decided to use Google Maps to display individual data points with D3.  The svg elements are placed in an overlay on the map.  This overlay is sandwiched in between other layers for the map.  Thus that layer cannot receive mouse events.  We overcame this with data points by putting “invisible” Google Maps markers on all the same locations as the svg elements.  This makes it appear that the svg elements are clickable, when they actually are not.  This would make tracking mouse coordinates to select a particular neighborhood very difficult.  

The other option was to have a drop down that would allow the user to select a neighborhood.  The problem with this is that the API only allows us to bring in data based on square coordinate blocks.  The neighborhoods are obviously not square and thus quite a bit of additional logic would need to be added to filter anything outside of the boundaries.  We decided to hold off on implementing the neighborhood selection to work on other aspects in case we ran out of time.  We did run out of time and thus we were unable to implement it. 

Development Process
--------------------
The development process took considerably longer than anticipated.  The first challenge was finding a data set that actually was interesting.  We initially wanted to explore vaccination data against the diseases they are designed to protect against.  However, the data for Washington State is sparse and only in .pdf files; making the process of consuming the data a nightmare.  We also looked at census and government data but finally decided on the data.seattle.gov Police 911 Incident data set. Once we decided what data set to use we worked on getting a storyboard put together so we could visualize how we wanted to lay out everything and what features we wanted to implement. The storyboard provided us with the general layout and features we wanted to use in our visualizaiton.  It also provided some animations and interactions.  We did leave some things, such as color, off of the storyboard.

The next step in our process was deciding on how we could implement all these features. We knew that we wanted to display it on a map and thus deciding how to do that took some time.  We would have preferred to use GeoJson data to map Seattle but we could not find this data.  The next obvious option was to use Google Maps.  The API for Google Maps made it easy to use an overlay to plot our svg data points on the map and provided easy API calls to convert latitude and longitude coordinates to pixel locations on the map.  We decided to use Google Maps for these reasons.  It wasn’t until later that we discovered that using d3 with Google Maps presented its own problems.  We had to come up with a way to simulate a mouse over event using Google Maps markers instead of the actual d3 event listeners.  This is because Google Maps inserts the overlay layer underneath a top layer that allows the user to manipulate the map. 

After we decided which features to include and how we could implement them we got a rough design up and running.  We then spent time fixing UI issues, fixing bugs and polishing the UI. Both Michael and myself worked on all aspects of the project.  However, I worked primarily on connecting up the back-end logic and Michael worked on the UI elements and the front-end development.  That way we could work simultaneously without stepping on each other’s toes. We also both worked on the writeup and storyboard elements together. 

Time Spent
--------------------
The project as a whole took us around 40 hours or so to complete. Longer, if you consider the time it took to find a data set that we wanted to use.  The portions that took us the longest were getting the different frameworks and libraries to work together.  We used D3, Google Maps, SODA 2, and JQuery to implement all of our features.  Getting D3 and Google Maps working together was the hardest hurdle to overcome.  We had to come up with some “creative” solutions to get the functionality that we wanted. It also took a considerable amount of time getting the API for SODA 2 to work properly.  Socrata recently updated their API and their website. There are many aspects of the API documentation that is missing or incomplete.  It took us at least several hours to just get a basic query working.  A rough breakdown is included below:

- Search for data: ~8 hours
- Storyboarding and brainstorming: ~2 hours
- Fighting SODA 2 API: ~3 hours
- Coding, debugging, polishing: ~35 hours

Running Instructions
--------------------
The code is entirely web based and all the frameworks needed are included in the GitHub repository.  All that should be needed to launch the website is to open index.html in the “code” directory.  Also, it is posted on a UW server at <a href="http://homes.cs.washington.edu/~bdwalker">http://homes.cs.washington.edu/~bdwalker</a>.

Tool and Data Locations
--------------------
* <a href="http://d3js.org">D3</a>
* <a href="https://developers.google.com/maps/">Google Maps API</a>
* <a href="https://data.seattle.gov/Public-Safety/Seattle-Police-Department-911-Incident-Response/3k2p-39jp">Data Set </a>
* <a href="http://www.jquery.com">jQuery</a>
* <a href="http://dev.socrata.com/">Socrata/SODA</a>
