const express = require('express');

const router = express.Router();

const db = require('../data/helpers/projectModel');

router.post('/', (req, res) => {
    const projectsBody = req.body;
    !projectsBody.name || !projectsBody.description
    ? res
        .status(400).json({ errorMessage: "Please provide a name and description for the project." })
    : db 
        .insert(req.body)
        .then(project => {
            res.status(201).json(project);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the project to the database" });
        })
})

router.get('/', (req, res) => {
    db
        .get()
        .then(db => {
            res
                .status(200)
                .json(db);
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The projects could not be retrieved."})
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db
    .remove(id)
    .then(project => {
        if (project) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: "The project with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The project could not be removed" });
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const projectBody = req.body;
    !projectBody.name || !projectBody.description
    ? res
        .status(400)
        .json({ errorMessage: "Please provide a name and description for the project." })
    : db
        .update(id, req.body)
        .then(count => {
            if (count === 0){
                res
                    .status(404)
                    .json({ message: "The project with the specified ID does not exist." })
            }
            db
                .get(id)
                .then(project => {
                    if (project.length === 0) {
                        res
                            .status(404)
                            .json({ message: "The project with the specified ID could not be located." })
                    } else {
                        res
                            .json(project)
                    }
                })
                .catch(err => {
                    res
                        .status(500)
                        .json({ message: "An error occured while attempting to locate the project."})
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The project information could not be modified." })
        })
});

router.get('/:id', (req, res) => {
    db
        .get(id)
        .then(db => {
            if (db === 0) {
            res
                .status(404)
                .json({ message: "unable to locate"});
            } else {
                res
                    .status(200)
                    .json(db)
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The projects could not be retrieved."})
        })
})

router.get('/:id/actions', (req, res) => {
    const id = req.params.id;
    db
        .getProjectActions(id)
        .then(db => {
            if (db === 0) {
            res
                .status(404)
                .json({ message: "unable to locate"});
            } else {
                res
                    .status(200)
                    .json(db)
            }
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The projects could not be retrieved."})
        })
})

module.exports = router;