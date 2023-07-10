const path = require('path');
const express = require('express');
const app = express();
const { readFileSync } = require("fs");
const dbc = require('./sqlConnection');
//const cors = require('cors');
//need this for https
//you can put in and out of comments as needed

const httpsServer = require('http').createServer(app);
// this is used in case https doesn't work
/*
const httpsServer = require('https').createServer({
    key: readFileSync("./sslcert/key.pem"),
    cert: readFileSync("./sslcert/cert.pem")
},app);
*/
const io = require('socket.io')(httpsServer);

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


const PORT = process.env.PORT || 3000;
httpsServer.listen(PORT,() => console.log(`Server listening on port ${PORT}`));


// Routing
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
    );
    next();
});

const botName = 'Blabber Bot';
const ACCEPTED_ROOMS = ["General", "Chill", "Gaming"];
/*

SET UP MYSQL TO GRAB USERNAME FROM DATABASE TO USE AS NAME.
USERPEERID IS 36 CHARACTERS

 */


// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({userPeerId, username, room}) => {
        if (!ACCEPTED_ROOMS.includes(room)) {
            socket.emit('roomNotValid');
        }
        /*
        var values = [userPeerId];
        var uname = [username];
        var sql = "INSERT INTO accounts uuid " +
            "VALUES ? " +
            "WHERE username = ?";
FIGURE OUT WAY TO ONLY ASSIGN PEERID ON FIRST TIME CONNECTION
SEND TO DATABASE AND AFTER THAT


CONNECT TO DB
GRAB USERNAME AND PEERID(GENERATED FROM REGISTER.PHP)
CALL THOSE FOR EACH ACTION USER TAKES.

COULD BE A COOKIES THING.
        dbc.query(sql, [values, uname], function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");

         */
            const user = userJoin(userPeerId, username, room);

            if (!user) {
                socket.emit('sameName');
            } else {

                socket.join(user.room);

                // only show in client to the user connecting
                socket.emit('message', formatMessage(botName, 'Welcome to Blabber!'));

                // Broadcast to all except the user itself in a specif room
                socket.broadcast
                    .to(user.room)
                    .emit(
                        'message',
                        formatMessage(botName, `${user.username} has joined the chat`)
                    );

                socket.broadcast.to(user.room).emit('user-connected', userPeerId)

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room) // E.g return: [{id: '6JhtU8cQGMZzzzj5AAAB', username: 'kaiimran', room: 'Malaysia'}]
                });

                socket.on('typing', () => {
                    console.log(username + ' is typing');

                    socket.broadcast
                        .to(user.room)
                        .emit('typing', {
                            username: user.username
                        });
                });

                socket.on('stop typing', () => {
                    console.log(username + ' stopped typing');

                    socket.broadcast
                        .to(user.room)
                        .emit('stop typing', {
                            username: user.username
                        });
                });

                // Listen for chatMessage
                socket.on('chatMessage', msg => {
                    const user = getCurrentUser(userPeerId);
                    console.log(username + ' sent message');

                    // Broadcast to all clients in the room
                    io
                        .to(user.room)
                        .emit('message', formatMessage(user.username, msg));
                });

                // Runs when client disconnects
                socket.on('disconnect', () => {
                    const user = userLeave(userPeerId);

                    if (user) {
                        io
                            .to(user.room)
                            .emit('message', formatMessage(botName, `${user.username} has left the chat`));
                    }

                    // Send users and room info
                    io.to(user.room).emit('roomUsers', {
                        room: user.room,
                        users: getRoomUsers(user.room)
                    });

                    socket.broadcast.to(user.room).emit('user-disconnected', userPeerId)
                });
            }
        });

    //})
});


/*const path = require('path');
const { readFileSync } = require("fs");
const express = require('express');
const app = express();
//const server = require('http').createServer(app);
const server = require('https').createServer({
    key: readFileSync("./sslcert/key.pem"),
    cert: readFileSync("./sslcert/cert.pem")
},app);
const io =  require('socket.io')(server);
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0',() => console.log(`Server listening on port: ${PORT}`));

// Routing
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Blabber Bot';
const ACCEPTED_ROOMS = ["General", "Chill", "Gaming"];

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ userPeerId, username, room }) => {
        if (!ACCEPTED_ROOMS.includes(room)) {
            socket.emit('roomNotValid');
        }

        const user = userJoin(userPeerId, username, room);

        if (!user) {
            socket.emit('sameName');
        } else {

            socket.join(user.room);

            // only show in client to the user connecting
            socket.emit('message', formatMessage(botName, 'Welcome to Blabber!'));

            // Broadcast to all except the user itself in a specif room
            socket.broadcast
                .to(user.room)
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has joined the chat`)
                );

            socket.broadcast.to(user.room).emit('user-connected', userPeerId)

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room) // E.g return: [{id: '6JhtU8cQGMZzzzj5AAAB', username: 'kaiimran', room: 'Malaysia'}]
            });

            socket.on('typing', () => {
                console.log('typing');

                socket.broadcast
                    .to(user.room)
                    .emit('typing', {
                        username: user.username
                    });
            });

            socket.on('stop typing', () => {
                console.log('stop typing');

                socket.broadcast
                    .to(user.room)
                    .emit('stop typing', {
                        username: user.username
                    });
            });

            // Listen for chatMessage
            socket.on('chatMessage', msg => {
                const user = getCurrentUser(userPeerId);

                // Broadcast to all clients in the room
                io
                    .to(user.room)
                    .emit('message', formatMessage(user.username, msg));
            });

            // Runs when client disconnects
            socket.on('disconnect', () => {
                const user = userLeave(userPeerId);

                if (user) {
                    io
                        .to(user.room)
                        .emit('message', formatMessage(botName, `${user.username} has left the chat`));
                }

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });

                socket.broadcast.to(user.room).emit('user-disconnected', userPeerId)
            });
        }
    });

});
*/










/*
app.post(`/login`, function(request, response) {
    let email = request.body.email;
    let password = request.body.password;
    if (email && password) {
        connection.query('SELECT * FROM accounts WHERE email = ? AND password = ?', [email, sha512(password)], function(error, result, fields) {
            if (error) throw error;
            if (result.length > 0) {
                request.session.loggedin = true;
                request.session.email = result[0].email;
                request.session.username = result[0].username;
                request.session.fullname = result[0].fullname;
		request.session.admin = result[0].isAdmin;
                if (request.session.isadmin == 1) {
                    request.session.isadmin = true
                }
                return response.redirect('/');
            } else {
                return response.send('Incorrect input data provided!');
            }
        });
    } else {
        return response.send('Please enter Email and Password!');
    }
});

app.get('/', function(request, response) {
    if (request.session.loggedin) {
        if (request.session.isadmin) {
            return response.sendFile(path.join(__dirname + '/../public/admin/admin.html'));
        } else {
            return response.sendFile(path.join(__dirname + '/../public/landing/index.html'));
        }
    } else {
        response.sendFile(path.join(__dirname + '/../public/login/login.html'));
    }
});

app.post('/pusher/auth', (request, response) => {
    const socketId = request.body.socket_id;
    const channel = request.body.channel_name;
    const presenceData = {
        user_id: request.session.username,
        user_info: {
            fullname: request.session.fullname,
        }
    };
    const auth = pusher.authorizeChannel(socketId, channel, presenceData);
    response.send(auth);
});

app.post("/pusher/user-auth", (request, response) => {
    const socketId = request.body.socket_id;
    const userData = {
        id: request.session.username,
        email: request.session.email,
        fullname: request.session.fullname,
    };
    const authUser = pusher.authenticateUser(socketId, userData);
    response.send(authUser);
});

app.post('/warn', (request, response) => {
    const warnResp = pusher.sendToUser(request.body.user_id, warningEvent, {
        message: warningMessage
    });
    response.send(warnResp);
});

app.post('/terminate', (request, response) => {
    pusher.sendToUser(request.body.user_id, terminateEvent, {
        message: terminateMessage
    });
    const terminateResp = pusher.terminateUserConnections(request.body.user_id);
    response.send(terminateResp)
});
*/
