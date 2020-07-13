<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\ThreekitData;
use App\Http\Resources\ThreekitData as ThreekitResource;
use App\Http\Resources\ThreekitDataCollection;

class ThreekitController extends Controller
{
    public function index()
    {
        return new ThreekitDataCollection(ThreekitData::all());
    }

    public function show($id)
    {
        return new ThreekitResource(ThreekitData::findOrFail($id));
    }

    public function store(Request $request)
    {
        $request->validate([
            'token' => 'required|max:255',
        ]);

        $threekitdata = ThreekitData::create([
            'token' => request('token')
        ]);

        return (new ThreekitResource($threekitdata))
                ->response()
                ->setStatusCode(201);
    }


    public function delete($id)
    {
        $threekitdata = ThreekitData::findOrFail($id);
        $threekitdata->delete();

        return response()->json(null, 204);
    }

}
