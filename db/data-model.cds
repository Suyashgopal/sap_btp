namespace my.student.management;

using { managed } from '@sap/cds/common';

entity Students : managed {
    key ID      : UUID;
    name        : String(100);
    age         : Integer;
    course      : String(50);
}
