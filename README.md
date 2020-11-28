# Agenda
This program is a basic agenda application that can be linked to a canvas profile

## Starting It
In the top left of the program, there is a settings tab. This is where you can type your Canvas API key and course IDs.

## Canvas Key
To get the key:
1. Go to `Canvas > Account > Settings`
2. Scroll to "Approved Integrations"
3. Click "New Access Token"
4. Enter "Agenda" for purpose and leave the expiration date blank.
5. Click generate code and be sure to copy the code that appears on the window.

If you ever forget the code you can regenerate the key at anytime by clicking "details" and then "Regenerate Token".

## Course IDs
To get course IDs:
1. Go to `Canvas > Courses`
2. Select a course

The URL will look like this: `udel.instructure.com/courses/*ID*`

3. Copy the ID number.

## Future Plans
- [ ] Create delete item button
- [ ] Create edit item button
- [ ] Make Agenda auto-refresh once an hour
- [ ] Remove the 10 assignment limit from Canvas API
- [ ] Deploy for actual use
