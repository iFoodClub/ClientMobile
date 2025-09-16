import { Redirect } from 'expo-router'
import React from 'react'

function _layout() {
    const isAuthenticated = false

    if (!isAuthenticated) {
        return <Redirect href="/sign-in" />
    }

    return (
        <div>_layout</div>
    )
}

export default _layout