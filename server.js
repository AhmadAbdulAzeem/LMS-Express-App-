const Joi = require('joi');
const bodyParser = require('body-parser');
const express = require('express');
var router = require('express').Router();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Environment variable
const port = process.env.port || 3000

app.listen(port, () => console.log(`Listeneing on port ${port}......`));

app.get('/web/courses/create', (req, res) => {
    ret = res.sendFile('course.html', { root: __dirname });
});

app.get('/web/students/create', (req, res) => {
    ret = res.sendFile('student.html', { root: __dirname });
});

/************************************************************************** Courses ************************************************/
const courses = [
    {
        name: 'course1',
        code: 'abc123',
        id: 1,
        description: 'xxxxxxxxxxxxxxxxxx'
    },
    {
        name: 'course2',
        code: 'xyz648',
        id: 2,
        description: 'ssssssssssssssssss'
    },
    {
        name: 'course3',
        code: 'wqd145',
        id: 3,
        description: 'mmmmmmmmmmmmmmmmmm'
    }
];

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/^[a-zA-Z]{3}[0-9]{3}$/),
        description: Joi.string().max(200)
    }
    return Joi.validate(course, schema);
}

// to get all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// to get single course
// api/courses/1 to get course of id 1
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }
    res.send(course);
});

// Add course
app.post('/api/courses', (req, res) => {

    const { error } = validateCourse(req.body);
    //console.log(result);

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // create a new course object
    const course = {
        name: req.body.name,
        code: req.body.code,
        id: courses.length + 1,
        description: req.body.description
    };
    courses.push(course);
    res.send(course);
});


// Updating resources
app.put('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('The course with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateCourse(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    course.name = req.body.name;
    course.code = req.body.code;
    course.description = req.body.description;
    res.send(course);
});


// Deleting a course
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // Return the same course
    res.send(course);
});


/********************************************************************* Students *********************************************/
const students = [
    {
        name: 'Ahmed',
        code: '1600118',
        id: 1
    },
    {
        name: 'Muhamed',
        code: '4596328',
        id: 2
    },
    {
        name: 'Sayed',
        code: '4532168',
        id: 3
    }
];

function validateStudent(student) {
    const schema = {
        name: Joi.string().required().regex(/^[a-zA-Z][a-zA-Z \-']+$/),
        code: Joi.string().regex(/^[a-zA-Z0-9]{7}$/)
    }
    return Joi.validate(student, schema);
}

// to get all students
app.get('/api/students', (req, res) => {
    res.send(students);
});

// to get single course
// api/courses/1 to get course of id 1
app.get('/api/students/:id', (req, res) => {
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe student with the given id was not found.');
        return;
    }
    res.send(student);
});

// Add student
app.post('/api/students', (req, res) => {
    const { error } = validateStudent(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // create a new student object
    const student = {
        name: req.body.name,
        code: req.body.code,
        id: students.length + 1
    };
    students.push(student);
    res.send(student);
});

// Updating student
app.put('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('The student with the given id was not found.');
        return;
    }

    // validate 
    // If not valid, return 400 bad request
    const { error } = validateStudent(req.body); // result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update the course 
    // Return the updated course
    student.name = req.body.name;
    student.code = req.body.code;
    res.send(student);
});

// Deleting a course
app.delete('/api/students/:id', (req, res) => {
    // Look up the course 
    // If not existing, return 404
    const student = students.find(c => c.id === parseInt(req.params.id));
    if (!student) // error 404 object not found
    {
        res.status(404).send('THe course with the given id was not found.');
        return;
    }

    // Delete
    const index = students.indexOf(student);
    students.splice(index, 1);

    // Return the same course
    res.send(student);
});