using my.student.management as db from '../db/data-model';

/**
 * Student Management Service
 * Exposes Students entity for CRUD operations
 */
service CatalogService @(impl:'./student-service.js') {
    /**
     * Expose Students entity with full CRUD operations
     * @odata.draft.enabled false
     */
    entity Students as projection on db.Students;
}
