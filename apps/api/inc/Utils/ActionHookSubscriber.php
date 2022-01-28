<?php

namespace StyrsoMissionskyrka\Utils;

/**
 * The ActionHookSubscriber describes a part of the application that needs to
 * connect to WordPress actions.
 *
 * An instance of this interface should be provided to an APIManager-instance
 * which will connect it all to the WordPress actions.
 */
interface ActionHookSubscriber
{
    /**
     * get_actions should return an array with keys corresponding to the action
     * which the class wants to hook into. And the value should be an array
     * where the first item is tha name of the callback function attached to
     * this instance. The other items in the array correspond to the other
     * arguments in the call to add_action.
     *
     * @return array An array of actions
     */
    public function get_actions(): array;
}
