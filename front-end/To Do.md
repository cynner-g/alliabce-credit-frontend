

[Credit Report]
We have to validate why “we have the wrong success report for bank/legal/supplier” and they are suppose to be pending and Incorporate suppose to be “DONE” **DONE**

COLOR for status not correct **DONE**

Ref ID. *we should have AC ID, not the _id (the alliance id report) - ****Done?****
Filter doesn’t work? (Select status) **Done**
Changing component for the “Date picker” **Done**
Ordering is not working 
we are not supposed to be able to order a report from an ADMIN (only from user or user manager) and from “simulate user” *TO validate the logic business - **Fixed - Enabled now for development**

Can’t download anything **
Naming of the status are WRONG ** need action status become : Warning?? **Done?**

[Credit report - Dropdown**]
From admin side we’re not suppose to see the Request Cancellation button..  ****DONE *****
If we change status “Message” should not only write the comment but add the status and say theirs a change in the status + comment (rewriting the logic of the change status and comments section)
We cant just change status, if we dont post any comment it doesnt do anything… **Done**

Pricing doesn’t work 

Status&Comment :
When we add a comment (we dont know if its private or public) need to show it somwhere or icon
After posting the comment (the comment stay in the text box) should be erased..  ***Done***
Status should be in a “box” which we can scroll so its not taking all the page, add max-height with scrolling ***Done***

****************CANNOT DO*********************
[Credit report Button : dropdown]
Show external link doesnt work
view credit application doesn’t work
Set Manually pricing doesnt work


[Credit report (VIEW form)]
“add bank” and add supplier should not be there in the view mode
Edit button doesnt work
Edit button should not be there if status is completed
[Order Report]
Full design missing **
Quick order dont work **ERROR
Step filling form goes directly to success message even if we didnt fill anything into the form ** How possible
I dont see the order (so its not working properly)
Missing “Legal Section” in step2 (we need to add province selection, to make sure in which province we will do the legal search)
We might use the field “State” and make it as a select province from the list..
**What happens if we send multiple bank for “plaid automation” we will need to send same number of plaid link? So they could pull 2 banks or more.. if necessary?
We will need to refine the “FORM” in a better view logic way for all data with some logic depending on what we have clicked roughly


Database Report:
Not completed at all?
Search page ?
API MISSING ?

Companies:
[Add company]
refine the form (naming)
pricing chart doesn’t work?
industry where we add those?
adding company doesn’t work ?
[Edit company]
Update doesn’t work either

[Add Sub-company]
Doesn’t work

[Edit Sub-company]
Doesn’t work + bring 404 error pages
*We need to show error when nothing happens for click (confirm)*

[company transactions details]
not working

[Companies / USER]
Filter doesn’t work
Filter Company access nothing there
Accept user (dont work) + If user created directly from admin should be accepted automatically
WORD “stimulate” should be changed for “simulate” and this function doesn’t work yet
Big problem on refresh user list?
[company : user add]
Company access we dont see entire access, only main company (where the sub-company)
[company : user edit]
once you edit an user it disappear
Why i can’t edit the user listed right now “usermanager_test” ?
when you try to edit a new user the “company access is not checked”
where is the active / inactive an user ??
Remove user (dont work) or archive it..
If you try to change role it disappear the user

[company - watchlist]
can’t create a second watchlist?
remove doesn’t work
how the “flagged works? API?
what is the query for the watchlist, when it run at what time and how it generate report for everyone
Companies limitation (doesn’t work and doesn’t count correctly) (3/50) where come the 50 (should come from companies setting) and 3 should be 4 as i see 4 companies (i think its hard code data)
[company - watchlist - create new watchlist]
doesn’t work
[company - watchlist - add company]
missing all province ? API?
You should fix the naming of “province” not proveince as manish wrote (everywhere, even in database)
we need an “ALL” for province
ref number is not mandatory (if not filled it do nothing)
	
[company - watchlist - add email]
doesn’t work

[Company - Aging]
doesn’t work - ** Need retrieval API, files to test for aging **

[Group]
Show companies doesn’t work
active /desactive work but dont have any view when we edit or create a companies so its not reflecting there
Delete group (doesn’t have a pop up) direct delete no confirm pop up validation?
[Legal Upload]
Button legal upload doesn’t work
Page only have dummy data (nothing work)
[My account (admin)]
Can’t create sub-admin
edit dont take any effect
Should we be able to add “password* in creation of account for sub-admin
Change password should be a pop up directly into system (not another page outside of the website)
	
[Email]
Doesn’t work

[Automation]
Doesn’t work
Platform Setting :
All configuration of the platform?
Where we add “industry” ?
All other default value for companies
** We should add a loading gif to know something happening between pages ?

[Header Menu]
Missing icon + must look better
Authentification pages:
Login page to redo
All other pages (forgot password)
Forgot password doesn’t work
**Need to change field with “React Suite” Component



<!-- Components to use from React Suite:
[Credit Reports]
1. "TagPicker" - For selecting status for filtering - https://rsuitejs.com/components/tag-picker/
2. "DateRangePicker" - Calendee with predefined days - https://rsuitejs.com/components/date-range-picker/#show-one-calendar
rsuitejs.comrsuitejs.com
TagPicker
Multi-select by tag and support new options
rsuitejs.com
rsuitejs.com
DateRangePicker
Used to quickly select a date range -->