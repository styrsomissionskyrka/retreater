<?php

namespace StyrsoMissionskyrka\Utils;

/**
 * The FilterHookSubscriber describes a part of the application that needs to
 * connect to WordPress filters.
 *
 * An instance of this interface should be provided to an APIManager-instance
 * which will connect it all to the WordPress filters.
 */
interface FilterHookSubscriber
{
    /**
     * get_filters should return an array with keys corresponding to the filter
     * which the class wants to hook into. And the value should be an array
     * where the first item is tha name of the callback function attached to
     * this instance. The other items in the array correspond to the other
     * arguments in the call to add_filter.
     *
     * @return array An array of filters
     */
    public function get_filters();
}
