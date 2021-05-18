GET         /students           => RES 200 + JSON(allStudents())
GET         /students/id        => RES 200 + JSON(singleStudent(id))
GET         /students?[params]  => RES 200 + JSON(filteredStudents([params]))
POST {body} /students           => RES 201 + {body + id}
PUT  {body} /students/id        => RES 200 + {modified body}
DELETE      /students/id        => RES 204