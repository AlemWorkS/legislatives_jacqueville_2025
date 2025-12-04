<?php

namespace App;

enum Roles: string
{
    //
    case ADMIN = 'admin';
    case SUPERVISOR = 'superviseur';
    case AGENT_BUREAU = 'agent';
}
