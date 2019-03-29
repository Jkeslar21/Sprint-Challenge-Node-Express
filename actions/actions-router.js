const express = require('express');

const router = express.Router();

const db = require('../data/helpers/actionModel');

router.post('/', (req, res) => {
    const actionsInfo = req.body;
    !actionsInfo.description || !actionsInfo.project_id || !actionsInfo.notes
    ? res
        .status(400).json({ errorMessage: "Please provide a project_id, description (max limit of 128 characters), and notes for the action." })
    : db 
        .insert(req.body)
        .then(action => {
            res.status(201).json(action);
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the action to the database" });
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
                .json({ error: "The requested action could not be retrieved."})
        })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;

    db
    .remove(id)
    .then(action => {
        if (action) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: "The action with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The action could not be removed" });
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const actionsInfo = req.body;
    !actionsInfo.description || !actionsInfo.project_id || !actionsInfo.notes
    ? res
        .status(400)
        .json({ errorMessage: "Please provide a project_id, description (max limit of 128 characters), and notes for the action." })
    : db
        .update(id, actionsInfo)
        .then(count => {
            if (count === 0){
                res
                    .status(404)
                    .json({ message: "The action with the specified ID does not exist." })
            }
            db
                .get(id)
                .then(action => {
                    if (action.length === 0) {
                        res
                            .status(404)
                            .json({ message: "The action with the specified ID could not be located." })
                    } else {
                        res
                            .json(action)
                    }
                })
                .catch(err => {
                    res
                        .status(500)
                        .json({ message: "An error occured while attempting to locate the action."})
                })
        })
        .catch(err => {
            res
                .status(500)
                .json({ error: "The requested action could not be modified." })
        })
});

module.exports = router;