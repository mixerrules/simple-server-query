# Simple Server Query
A Simple Source Server Querying script that will iterates thru a user provided list of IPs and Ports

(THIS IS ONLY TESTED WITH SOURCE SERVERS)

## Requirements
- [Deno](https://deno.land) 1.37 or higher

## Installation
1. Install Deno
2. Download to the script
3. Open the script in NotePad or your favorite IDE
4. Edit the array at line 4 to use the IP(s) of your servers
5. (Optional) IF YOU HAVE MORE THAN 6 SERVERS, Uncomment lines 10 and change "27015" to be the starting port for your range then change the 2nd number to the highest numbered port in your range
6. (ingore if you used Step 5) Edit the array at line 5 to use the PORT(s) of your servers
7. Open the folder that has the script in it in command prompt or terminal.
8. run `Deno run --allow-net --allow-write serverdata.ts`
9. Enjoy your updating Json file

## License
GNU General Public License v3.0
