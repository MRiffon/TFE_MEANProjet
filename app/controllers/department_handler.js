/**
 * Created by Michaël and Martin on 25-07-16.
 */

var mongoose = require('mongoose');
var Department = require('../models/department');

module.exports = {
    list: function(req, res){
        Department.find(function(err, departments){
            if(err){
                res.send(err);
            }
            res.json(departments);
        });
    },

    delete: function(req, res){
        Department.remove({
            _id: req.params.department_id
        }, function(err, department){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', department: department});
        });
    },

    creation: function(req, res){
        var department = new Department();

        department.name = req.body.name;

        department.save(function(err){
            if (err){
                res.send(err);
            } else {
                res.json(department);
            }
        });
    }
};