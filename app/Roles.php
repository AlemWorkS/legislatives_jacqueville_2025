<?php

namespace App;

enum Roles: string
{
    //
    case ADMIN = 'admin';
    case SUPERVISOR = 'supervisor';
    case AGENT_BUREAU = 'agent de bureau';
}
