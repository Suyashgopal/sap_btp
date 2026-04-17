using my.student.management as db from '../db/data-model';

service CatalogService @(impl:'./student-service.js') {
    entity Students as projection on db.Students;
}
