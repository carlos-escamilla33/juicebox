const {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById
} = require('./index');

const createInitialUsers = async () => {
    try {
        console.log("Starting to create users...");

        await createUser({
            username: 'albert',
            password: 'bertie99',
            name: 'Al Bert',
            location: 'Sidney, Australia',
            active: true
        });
        await createUser({
            username: 'sandra',
            password: '2sandy4me',
            name: "Al Bert",
            location: 'Sidney, Australia',
            active: true

        });
        await createUser({
            username: 'glamgal',
            password: 'soglam',
            name: 'Joshua',
            location: 'Upper East Side',
            active: true
        });

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}


const dropTables = async () => {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
      `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

const createTables = async () => {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
      `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

const createInitialPosts = async () => {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();

        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post."
        })

        await createPost({
            authorId: sandra.id,
            title: "I love pugs",
            content: "Pugs are really chubby."
        })

        await createPost({
            authorId: glamgal.id,
            title: "I love weiner dogs",
            content: "A lot of them have a lot of attitude."
        })
    }
    catch (error) {
        throw error
    }
}

const testDB = async () => {
    try {
        console.log("Starting to test database....");

        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result", users);

        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

       console.log("Calling getAllPosts");
       const posts = await getAllPosts();
       console.log("Result:", posts);

       console.log("Calling updatePosts on posts[0]");
       const updatePostResults = await updatePost(posts[0].id, {
           title: "New Title",
           content: "Updated Content"
       });
       console.log("Result:", updatePostResults);

       console.log("Calling getUserById with 1");
       const albert = await getUserById(1);
       console.log("Result:",  albert);

       console.log("Finished database tests!");

    } catch (error) {
        console.error("Error testing database!");
        throw error;
    }
}

const rebuildDB = async () => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch (error) {
        throw error;
    }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());