import React from 'react'
import { JournalCheck } from 'react-bootstrap-icons';

function Footer() {
    return (
        <div class="container">
            <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                <div class="col-md-4 d-flex align-items-center">
                    <h4 className='fw-bolder'><JournalCheck className='mb-2' style={{ color: "ECC00F" }} /> TodoList</h4>
                </div>
                <div class="nav col-md-4 justify-content-end d-flex">
                    <span class="mb-3 mb-md-0 text-muted">TODOLIST APP v3 © 2022 JGANDRADE</span>
                </div>
            </footer>
        </div>
    )
}

export default Footer